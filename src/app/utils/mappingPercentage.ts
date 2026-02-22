export const mappingPercentage =(total: number, progress: number)=>{
  return total > 0? Math.ceil((progress / total ) * 100):0
}