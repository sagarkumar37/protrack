async function getCurrentDate(index) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - index);
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
  
    console.log(`${year}-${month}-${day}`)
    console.log("date")

    
    return `${year}-${month}-${day}`;
  }
console.log(getCurrentDate(-1));
