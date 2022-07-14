import React, { useCallback, useState, useRef } from 'react'
import { useFetch, useDebounce } from './hooks'

const App = () => {
  const [title, setTitle] = useState('')
  const [page, setPage] = useState(1)
  const { books, error, loading, hasMore } = useFetch(title, page)
  const lastElementRef = useRef()

  const handleChangeTitle = (e) => {
    setTitle(e.target.value)
    setPage(1)
  }

  const setObserverLastElement = useCallback(
    (node) => {
      if (loading) return
      if (lastElementRef.current) {
        lastElementRef.current.disconnect()
      }
      lastElementRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((page) => page + 1)
        }
      })
      if (node) lastElementRef.current.observe(node)
    },
    [loading, hasMore]
  )

  return (
    <div className='min-h-screen min-w-screen bg-slate-500'>
      <div className='flex flex-col justify-center items-center'>
        <label htmlFor='title' className='text-white font-bold'>
          Cari Film
        </label>
        <input
          type='text'
          className='max-w-[50%] p-2 rounded-lg'
          value={title}
          onChange={handleChangeTitle}
        />
      </div>

      <div className=' mt-4 flex flex-col justify-center items-center text-slate-200'>
        <div>
          {!error && (
            <ul className='mx-4'>
              {books.map((value, index) =>
                index + 1 === books.length ? (
                  <li key={index} ref={setObserverLastElement}>
                    {value}
                  </li>
                ) : (
                  <li key={index}>{value}</li>
                )
              )}
            </ul>
          )}
        </div>
        <div className='font-bold text-2xl '>
          {loading && !error && 'Loading.....'}
        </div>
        <div>{error && 'Error'}</div>
      </div>
    </div>
  )
}

export default App
