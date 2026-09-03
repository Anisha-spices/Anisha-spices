import { NextResponse } from 'next/server'

// In-memory cache for fast lookups (avoids repeated external API calls)
const pincodeCache = new Map<
  string,
  {
    valid: boolean
    district?: string
    city?: string
    state?: string
    postOffices?: string[]
    timestamp: number
  }
>()

// 24 hours cache TTL
const CACHE_TTL = 24 * 60 * 60 * 1000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = (searchParams.get('code') || '').trim()

  // Validate 6-digit numeric pattern
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { valid: false, message: 'PIN code must be a 6-digit number.' },
      { status: 400 }
    )
  }

  // Check in-memory cache
  const cached = pincodeCache.get(code)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnishaSpices/1.0)',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Postal API responded with status ${response.status}`)
    }

    const data = await response.json()
    const result = Array.isArray(data) && data.length > 0 ? data[0] : null

    if (result && result.Status === 'Success' && Array.isArray(result.PostOffice) && result.PostOffice.length > 0) {
      const primaryOffice = result.PostOffice[0]
      const district = (primaryOffice.District || '').trim()
      const state = (primaryOffice.State || '').trim()
      const defaultCity = (primaryOffice.Block || primaryOffice.Division || district).trim()

      // Deduplicated unique post offices / localities list
      const postOfficesSet = new Set<string>()
      
      // If district exists, add as primary option
      if (district) {
        postOfficesSet.add(`${district} (City Center)`)
      }

      result.PostOffice.forEach((po: any) => {
        const name = (po.Name || '').trim()
        if (name) postOfficesSet.add(name)
      })

      const postOffices = Array.from(postOfficesSet)
      const primaryCity = postOffices[0] || defaultCity || district

      const payload = {
        valid: true,
        district,
        city: primaryCity,
        state,
        postOffices,
        timestamp: Date.now(),
      }

      pincodeCache.set(code, payload)

      return NextResponse.json(payload, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      })
    }

    // Invalid PIN code (no records found)
    const invalidPayload = {
      valid: false,
      message: 'Invalid Indian Postal PIN code. Please enter a valid 6-digit pincode.',
      timestamp: Date.now(),
    }
    pincodeCache.set(code, invalidPayload)

    return NextResponse.json(invalidPayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400',
      },
    })
  } catch (err: any) {
    console.warn(`Pincode lookup error for ${code}:`, err.message)
    // In case of external API downtime/timeout, don't completely block user
    // Fall back to valid 6-digit with empty auto-fill
    return NextResponse.json(
      {
        valid: true,
        fallback: true,
        message: 'Postal verification service temporarily busy.',
      },
      { status: 200 }
    )
  }
}
