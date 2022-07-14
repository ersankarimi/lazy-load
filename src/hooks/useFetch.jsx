import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const apiUrl = `https://openlibrary.org/search.json`
const useFetch = (title, page) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [title])

  useEffect(() => {
    setLoading(true)
    setError(false)

    const controller = new AbortController()
    const params = new URLSearchParams({ q: title, page: page }).toString()
    const request = new Request(`${apiUrl}?${params}`, {
      method: 'GET',
      signal: controller.signal,
    })

    const fetchData = async (request) => {
      const response = await fetch(request)
        .then((res) => res.json())
        .then((booksList) => {
          setBooks((prevBooks) => [
            ...new Set([
              ...prevBooks,
              ...booksList.docs.map((value) => value.title),
            ]),
          ])
          setLoading(false)
          setError(false)
          setHasMore(booksList.docs.length > 0)
        })
        .catch((error) => {
          if (controller.signal.aborted) return
          setError(true)
        })
    }

    fetchData(request)

    return () => {
      controller.abort()
    }
  }, [title, page])

  return { books, loading, error, hasMore }
}

export default useFetch
