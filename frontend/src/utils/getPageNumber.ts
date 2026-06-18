
export default function getPageNumber(totalPage ?: number, currentPage ?: number){

    let pages: number[] = [];

    if(!totalPage || !currentPage){
        return []
    }

    for(let i=currentPage-1; i<=currentPage+1; i++){
        if(i >0 && i<=totalPage){
            pages.push(i);
        }
    }

    return pages;
}