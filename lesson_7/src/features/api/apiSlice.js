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
   tagTypes: ['Post'],
   // very similar to the reducer actions we defined when we were using thunks with reducers
   // **IMPORTANT: NOTE THAT "query" AND "mutation" ARE DIFFERENT. "qurey" ONLY FETCHES DATA AND "mutation" ALTERS THE DATA.
   // FOR EXTENDED RTK QUERY, EVEN THOUGH YOU DEFINE THE ENDPOINTS IN THE SLICE FILES, NOT INCLUDING THIS LINE BELOW WILL THROW AN ERROR
   endpoints : (builder)=>({})
})