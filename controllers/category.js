import Category from "../models/category.js"
import asyncWrapper from "../utils/asyncWrapper.js";

async function create ( req, res, next) {
    const [ monogoErr, category ] = await asyncWrapper( Category.create( req.category ) );
    if ( !monogoErr )
        return res.status( 200 ).json( category );
    return next(monogoErr)
}

async function update ( req, res, next ) {
    const [ monogoErr, updatedCategory ] = await asyncWrapper( Category
        .findOneAndUpdate( { id: req.params.id }, req.category, {runValidators:true} ) );
    if ( monogoErr )
        return next( monogoErr );
    if ( !updatedCategory )
        return res.sendStatus(404);
    return res.status( 200 ).json( updatedCategory );
}

async function remove ( req, res ) { 
    const deletedCategory = await Category.findOneAndDelete( { id: req.params.id } );
    if ( !deletedCategory )
        return res.sendStatus( 404 );
    return res.status( 200 ).json( deletedCategory );
}

async function getAll ( req, res ) {
    const categories = await Category.find();
    res.status( 200 ).json(categories);
}

async function getOne ( req, res ) {
    const category = await Category.find( { id: req.params.id } );
    return res.status(200).json( category );
}

export default {create , update, remove, getAll, getOne }
