// I need a domain context for better name..
export type Tab2Entity = {
  id: string,     // idealy some sort of uuid
  value: string,  // the text that was entered in the input field
  order: number   // different browsers don't always perserve json array's order of items
}

export type Tab2Data = {
  field3?: string;  // I am not sure if this field should be saved.
  field4?: Tab2Entity[];
}
