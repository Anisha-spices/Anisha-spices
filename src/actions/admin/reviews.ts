'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export type ActionResult = {
  error?: string
  success?: boolean
}

async function getAdminClient() {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get('admin_session')?.value === 'authenticated') {
      return createAdminClient()
    }
  } catch {
    // Ignore cookie read failure
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      return createAdminClient()
    }
  } catch {
    // Ignore auth failure
  }

  return null
}

export async function approveReview(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await getAdminClient()
    if (!supabase) {
      return { error: 'Unauthorized. Admin access required.' }
    }

    const reviewId = formData.get('id') as string
    if (!reviewId) {
      return { error: 'Review ID is required.' }
    }

    // Approve the review
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId)

    if (updateError) {
      console.error('Error approving review:', updateError)
      return { error: 'Failed to approve review.' }
    }

    // Update the product's average_rating and review_count
    // To do this reliably, we can trigger an edge function or calculate it here.
    // For now we can calculate it manually or let a trigger handle it.
    // Assuming the database doesn't have a trigger yet, let's fetch all approved reviews for the product
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', reviewId)
      .single()

    if (reviewData?.product_id) {
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', reviewData.product_id)
        .eq('is_approved', true)

      if (allReviews && allReviews.length > 0) {
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0)
        const avg = sum / allReviews.length
        
        await supabase
          .from('products')
          .update({
            average_rating: parseFloat(avg.toFixed(1)),
            review_count: allReviews.length
          })
          .eq('id', reviewData.product_id)
      }
    }

    revalidatePath('/admin/reviews')
    revalidatePath(`/product/[slug]`)
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error approving review:', err)
    return { error: 'An unexpected error occurred.' }
  }
}

export async function deleteReview(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await getAdminClient()
    if (!supabase) {
      return { error: 'Unauthorized. Admin access required.' }
    }

    const reviewId = formData.get('id') as string
    if (!reviewId) {
      return { error: 'Review ID is required.' }
    }

    // Fetch the product_id before deleting so we can update the aggregates
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('product_id, is_approved')
      .eq('id', reviewId)
      .single()

    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      console.error('Error deleting review:', deleteError)
      return { error: 'Failed to delete review.' }
    }

    // If it was an approved review, update the aggregates
    if (reviewData?.is_approved && reviewData.product_id) {
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', reviewData.product_id)
        .eq('is_approved', true)

      if (allReviews && allReviews.length > 0) {
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0)
        const avg = sum / allReviews.length
        
        await supabase
          .from('products')
          .update({
            average_rating: parseFloat(avg.toFixed(1)),
            review_count: allReviews.length
          })
          .eq('id', reviewData.product_id)
      } else if (allReviews && allReviews.length === 0) {
        await supabase
          .from('products')
          .update({
            average_rating: 0,
            review_count: 0
          })
          .eq('id', reviewData.product_id)
      }
    }

    revalidatePath('/admin/reviews')
    revalidatePath(`/product/[slug]`)
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error deleting review:', err)
    return { error: 'An unexpected error occurred.' }
  }
}
