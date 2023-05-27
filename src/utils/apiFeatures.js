class ApiFeatures{
    constructor(query , queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){

        const category = this.queryStr?.category ? {

            category : {
                $regex : this.queryStr?.category,
                $options : "i"
            }
        } : {}

        const subcategory = this.queryStr?.subcategory ? {

            subcategory : {
                $regex : this.queryStr?.subcategory,
                $options : "i"
            }
        } : {}

        const title = this.queryStr?.title ? {

            title : {
                $regex : this.queryStr?.title,
                $options : "i"
            }
        } : {}

        this.query = this.query.find({...category , ...subcategory , ...title})

        return this
    }
}

module.exports = ApiFeatures