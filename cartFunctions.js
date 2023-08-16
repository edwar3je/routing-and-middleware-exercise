function add(arr, name, price){
    if(isNaN(name) && !isNaN(price)){
        let newObj = {name: name, price: price};
        arr.push(newObj);
        return {"added": {"name": name, "price": price}};
    }
    return false
}

function find(arr, name){
    if(arr && isNaN(name)){
        for (let a of arr){
            if (a.name == name){
                return a
            }
        }
        return false    
    }
    return false
}

function modify(arr, name, newName=null, newPrice=null){
    if(arr && find(arr, name)){
        if(newName && newPrice){
            if(isNaN(newName) && !isNaN(newPrice)){
                for (let a of arr){
                    if (a.name == name){
                        a.name = newName;
                        a.price = newPrice
                    }
                }
                return {"updated": {"name": newName, "price": newPrice}}
            }
            return false
        }
        else if(newName && !newPrice){
            if(isNaN(newName)){
                for (let a of arr){
                    if (a.name == name){
                        a.name = newName
                    }
                }
                return {"updated": {"name": newName}}
            }
            return false
        }
        else if(newPrice && !newName){
            if(!isNaN(newPrice)){
                for (let a of arr){
                    if (a.name == name){
                        a.price = newPrice
                    }
                }
                return {"updated": {"price": newPrice}}
            }
            return false
        }
        return false
    }
    return false
}

function remove(arr, name){
    if(arr && find(arr, name)){
        let index;
        for (let i=0; i<arr.length; i++){
            let currObj = arr[i];
            if(currObj.name == name){
                index = i;
            }
        }
        arr.splice(index, 1);
        return {message: "Deleted"};
    }
    return false
}

module.exports = {add: add, find: find, modify: modify, remove: remove}