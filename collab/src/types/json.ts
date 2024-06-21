/**
 * Recursive type representing any value that can be returned by deserialising a JSON document.
 * 
 * By extension, it is also a valid type for any field of any object within a JSON document and 
 * any member of any array within a JSON document. 
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
  