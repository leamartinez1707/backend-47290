"use strict";(self.webpackChunkprimera_entrega=self.webpackChunkprimera_entrega||[]).push([[181],{8749:(e,t,r)=>{r.d(t,{B:()=>u});var s=r(6037),a=r(2124);const o=new s.Schema({title:{type:String,required:!0},description:{type:String,required:!0},price:{type:Number,required:!0},code:{type:String,unique:!0,required:!0},stock:{type:Number,required:!0},category:{type:String,required:!0},thumbnail:{type:[String],default:[]},owner:{type:String,required:!0,default:"admin",ref:"users"}});o.plugin(a);const u=s.model("products",o)},4181:(e,t,r)=>{r.d(t,{default:()=>a});var s=r(8749);class a{constructor(){this.model=s.B}getAll=async()=>{try{return{statusCode:200,response:{status:"success",payload:await this.model.find().lean()}}}catch(e){return{statusCode:500,response:{status:"error",error:e.message}}}};getById=async e=>{try{const t=await this.model.findOne({_id:e}).lean();return t&&null!==t?{statusCode:200,response:{status:"success",payload:t}}:{statusCode:404,response:{status:"error",error:"Product does not exist"}}}catch(t){return{statusCode:500,response:{status:"error",error:`El producto ${e} no existe o ID inválida.`}}}};create=async e=>{try{let t=await this.model.create(e);return t?{statusCode:201,response:{status:"success",payload:t}}:{statusCode:400,response:{status:"error",error:"The product could not be added"}}}catch(e){return{statusCode:500,response:{status:"error",error:"err.message"}}}};update=async(e,t)=>{try{if(!(t.title&&t.description&&t.price&&t.code&&t.category&&t.thumbnail))return{statusCode:400,response:{status:"error",error:"Incomplete values"}};let r=await this.model.updateOne({_id:e},t);return r?{statusCode:200,response:{status:"success",payload:r}}:{statusCode:400,response:{status:"error",error:"The product could not be updated"}}}catch(e){return{statusCode:500,response:{status:"error",error:e.message}}}};delete=async e=>{try{let t=await this.model.deleteOne({_id:e}).lean();return t?{statusCode:200,response:{status:"success",payload:t}}:{statusCode:400,response:{status:"error",error:"The product could not be deleted"}}}catch(e){return{statusCode:500,response:{status:"error",error:e.message}}}}}}}]);