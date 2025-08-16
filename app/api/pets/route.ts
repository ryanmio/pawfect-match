import { NextResponse } from "next/server"
import { fetchPetsWithFilters } from "@/lib/petfinder-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "20")

    const type = searchParams.get("type")
    const age = searchParams.get("age")
    const size = searchParams.get("size")
    const gender = searchParams.get("gender")
    const location = searchParams.get("location")
    const distance = searchParams.get("distance")
    const hasPhotos = searchParams.get("hasPhotos")
    const goodWithKids = searchParams.get("goodWithKids")
    const goodWithDogs = searchParams.get("goodWithDogs")
    const goodWithCats = searchParams.get("goodWithCats")

    const data = await fetchPetsWithFilters(page, limit, {
      type: type || null,
      age: age || null,
      size: size || null,
      gender: gender || null,
      location: location || null,
      distance: distance ? Number(distance) : null,
      hasPhotos: hasPhotos === "true",
      goodWithKids: goodWithKids ? goodWithKids === "true" : null,
      goodWithDogs: goodWithDogs ? goodWithDogs === "true" : null,
      goodWithCats: goodWithCats ? goodWithCats === "true" : null,
    })

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 })
  }
}


