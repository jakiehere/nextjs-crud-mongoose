import { useState } from 'react';

import axios from 'axios';
import moment from 'moment';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaPenSquare,
  FaTrash,
} from 'react-icons/fa';
import useSWR from 'swr';

import style from '../styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] })

const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())

export default function Home() {
  const [title, setTitle] = useState<string>('');
  const [updateId, setUpdateId] = useState<string | undefined>()
  const [search, setSearch] = useState<string>('')
  const [displayBtn, setDiplayBtn] = useState<string>('hidden')

  const url = search ? `/api/todo?todo=${search}` : '/api/todo'

  const { mutate, data, isLoading } = useSWR(url, fetcher)

  const handleSearch = (value: string) => {
    setSearch(value)
    mutate(`/api/todo?todo=${search}`)
  }

  const createTodo = async (e: any) => {
    e.preventDefault();
    try {
      if (updateId) {
        const req = await axios.put('/api/todo', { todo: title }, { params: { id: updateId } })
        setTitle('');
        setUpdateId(undefined);
        if (req.status === 200) {
          toast.success(req.data.message)
          mutate('/api/todo')
        }
      } else {
        const req = await axios.post('/api/todo', { todo: title });
        setTitle('');
        if (req.status === 200) {
          toast.success(req.data.message)
          mutate('/api/todo')
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  };

  const editTodo = (id?: string, todo?: string) => {
    setTitle(todo ?? title)
    setUpdateId(id)
  }

  const markCompleted = async (id: string, isCompleted: boolean) => {
    try {
      const req = await axios.put('/api/todo', { isCompleted: !isCompleted }, { params: { id } })
      if (req.status === 200) {
        toast.success(req.data.message)
        setTitle('');
        mutate('/api/todo')
      }
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  };

  const deleteTodo = async (id?: string) => {
    try {
      const req = await axios.delete('/api/todo', { params: { id } })
      if (req.status === 200) {
        toast.success(req.data.message)
        setTitle('');
        mutate('/api/todo')
      }
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  }


  return (
    <>
      <Head>
        <title>Todo list with Mongo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        {isLoading && <p>Loading...</p>}

        <div className='max-w-5xl h-fit rounded-lg text-center bg-gray-500 p-5'>
          <div className='mx-0 flex justify-between px-4 sm:px-8' >
            <form onSubmit={createTodo} className="w-[40%]">
              <input
                type="text"
                value={title}
                placeholder='Create...'
                onChange={(e: any) => setTitle(e.target.value)}
                className="border-2 bg-gray-700 border-white rounded-md px-2 text-white w-full"
              />
            </form>
            <input
              type="text"
              value={search}
              placeholder='Search here...'
              onChange={(e: any) => handleSearch(e.target.value)}
              className="border-2 bg-gray-700 border-white rounded-md px-2 text-white w-[40%]"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-4">
              <div>
                <h2 className="text-2xl font-semibold leading-tight text-white">Todo List</h2>
              </div>

              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div
                  className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                >
                  {typeof (data) === "object" ?
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th
                            className="px-8 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            Date & Time
                          </th>
                          <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            Is Complete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map((val: any, index: number) => (
                          <tr key={index}>
                            <td className={`px-8 py-5 border-b border-gray-200 bg-white text-sm flex group`}>
                              <p className={`todo-title whitespace-no-wrap px-3 float-left ${val.isCompleted ? 'line-through text-gray-700' : 'text-gray-900'}`}>{val.todo}</p>
                              <div className='hidden group-hover:block'>
                                <button
                                  type="button"
                                  className="inline-block text-gray-500 hover:text-gray-700 mx-2"
                                  onClick={() => editTodo(val._id, val.todo)}
                                >
                                  <FaPenSquare />
                                </button>
                                <button
                                  type="button"
                                  className="inline-block text-gray-500 hover:text-gray-700"
                                  onClick={() => deleteTodo(val._id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">{moment(val.updatedAt ?? val.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <input
                                type="checkbox"
                                className="checking"
                                checked={val.isCompleted}
                                onChange={() => markCompleted(val._id, val.isCompleted)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    :
                    <p className='text-white ml-10'>{data}</p>
                  }
                  {isLoading &&
                    <div className="flex items-center justify-center">
                      <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...
                        </span>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}