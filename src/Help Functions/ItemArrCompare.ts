const ItemArrCompare = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) {
        return false
    } else {
        let found = false;
        for (let i = 0; i < arr1.length; i++) {
            found=false;
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].id === arr2[j].id) {
                    found = true;
                }
            }
            if (!found) {
                return false
            }
        }
        return true
    }
}
export default ItemArrCompare