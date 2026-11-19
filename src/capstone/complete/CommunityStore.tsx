import {createContext,useContext,useState} from 'react'
import type {ReactNode,Dispatch,SetStateAction} from 'react'
import {initialPosts,type CommunityPost} from './model'
import {attachSeedPhotos} from './community-images'
type Store={posts:CommunityPost[];setPosts:Dispatch<SetStateAction<CommunityPost[]>>}
const Context=createContext<Store|null>(null)
export function CommunityProvider({owner,children}:{owner:string;children:ReactNode}){
 const [posts,setPosts]=useState(()=>attachSeedPhotos(initialPosts(owner)))
 return <Context.Provider value={{posts,setPosts}}>{children}</Context.Provider>
}
export function useCommunityStore(){const store=useContext(Context);if(!store)throw Error('CommunityProvider required');return store}
