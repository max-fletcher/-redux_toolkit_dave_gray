import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// its basically an object.
export const apiSlice = createApi({
   // If you don't define reducerPath, you will get the default which is 'api'(i.e src/features/api). If you want to define custom path,
   // you are free to do so.
   reducerPath: 'api',
   // contains base query URL. IT uses the fetchBaseQuery hook. Since it uses json-server, the default endpoints will be setup
   // automatically while usng this baseURL.
   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
   // Results of an RTK Query gets cached and we need to use this line declare tag names that can be used to invalidate the cache
   // when mutations with these tag names are triggered
   tagTypes: ['Todos'],
   // very similar to the reducer actions we defined when we were using thunks with reducers
   // **IMPORTANT: NOTE THAT "query" AND "mutation" ARE DIFFERENT. "qurey" ONLY FETCHES DATA AND "mutation" ALTERS THE DATA.
   endpoints : (builder)=>({
      getTodos: builder.query({ // get all todos
         query: () => '/todos',
         transformResponse: res => res.sort((a,b) => b.id - a.id), // fn to sort all todos by id after fetching and before cacheing
         providesTags: ['Todos'] // telling this query to invalidate cache and re-fetch data(i.e re-run this query) on running mutations
                                 // that has "invalidatesTags: ['Todos']".
      }),

      addTodo: builder.mutation({ // create todo
         query: (todo) => ({
            url: '/todos',
            method: 'POST',
            body: todo
         }),
         invalidatesTags: ['Todos'] // instructing this query to invalidate cache and re-run "getTodos"(since it hasprovidesTags: ['Todos'])
                                    // when this query is run. If any other query has "hasprovidesTags: ['Todos']", they will be re-run too.
      }),

      updateTodo: builder.mutation({ // update todo
         query: (todo) => ({
            url: `/todos/${todo.id}`,
            method: 'PATCH',
            body: todo
         }),
         invalidatesTags: ['Todos'] // instructing this query to invalidate cache and re-run "getTodos"(since it has providesTags: ['Todos'])
                                    // when this query is run. If any other query has "hasprovidesTags: ['Todos']", they will be re-run too.
      }),

      deleteTodo: builder.mutation({ // delete todo
         // using destructuring to get the "id" only since we only need "id" to delete the todo, not the entire todo
         query: ({ id }) => ({
            url: `/todos/${id}`,
            method: 'DELETE',
            body: id
         }),
         invalidatesTags: ['Todos'] // instructing this query to invalidate cache and re-run "getTodos"(since it hasprovidesTags: ['Todos'])
                                    // when this query is run. If any other query has "hasprovidesTags: ['Todos']", they will be re-run too.
      }),
   })
})

export const {
   // The convention is that the name must match the camel-case names for the queries defined inside the endpoint object. It should
   // start with "use" and end with "Query" with the pascal-cased query name sandwiched between them. So if we define an endpoint
   // called "getPizzas", the export here should be called "useGetPizzasQuery".
   // **IMPORTANT: NOTE THAT QUERY AND MUTATION ARE DIFFERENT. QUERY ONLY FETCHES DATA AND MUTATON ALTERS THE DATA
   useGetTodosQuery,
   useAddTodoMutation,
   useUpdateTodoMutation,
   useDeleteTodoMutation,
} = apiSlice