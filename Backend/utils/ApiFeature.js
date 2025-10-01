class ApiFeature{
    constructor(query,queryString,q){
      this.queryString=queryString
      this.query=query
      
    }
    filter(){
      
       const queryObj={...this.queryString}
       const excludedFields=['page','sort','limit','fields','playersJoined']
       excludedFields.forEach(el=>delete queryObj[el])
       
       const q2={...this.q}
       console.log('hello'+q2)
      let queryStr=JSON.stringify(queryObj)
      console.log('tatakia',queryStr)
      let q3=JSON.stringify(q2)
      queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
      console.log('tatakai2',queryStr)
      if(q3=='{}'){
      
        this.query=this.query.find(JSON.parse(queryStr),JSON.parse(q3))
      }
      else{
       
        this.query=this.query.find(JSON.parse(q3))
        this.query=this.query.find(JSON.parse(queryStr))
      
        
   //console.log(JSON.parse(q3))
      }
        return this

}
paginate(){
  const page=this.queryString.page*1||1
  const limit=this.queryString.limit*1||100
  const playersJoined={'playersJoined':this.queryString.playersJoined}
  console.log('hello2'+playersJoined)
  const skip=(page-1)*limit
 // console.log(skip+" "+limit)
    if(this.queryString.playersJoined)
  this.query=this.query.find(playersJoined)

  this.query=this.query.populate('createdBy').skip(skip).limit(limit)
 // console.log(this.query)
  return this;
}
}
module.exports=ApiFeature