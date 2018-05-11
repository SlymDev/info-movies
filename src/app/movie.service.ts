import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { HttpClient, HttpParams } from '@angular/common/http'

import { Movie } from './Movie'

@Injectable()
export class MovieService {
  private seletedMovie$:Subject<Movie> = new Subject<Movie>()
  private apiKey:string = "9d041a689f69d0fc6bb4d8cbbc52c118"
  private baseApiUrl:string = "https://api.themoviedb.org/3/search/movie"
  private baseConfigurationUrl:string = "https://api.themoviedb.org/3/configuration"
  private imageBaseUrl:string = ""
  private imageSizes:{backdrop?:string[], poster?:string[] } = {}

  constructor( private http:HttpClient) { this.setImageConfiguration() }

  get currentMovie(){
  	return this.seletedMovie$
  }

  searchMovie(query:string){
  	const params = new HttpParams().set('api_key', this.apiKey).set('query', query)
  	return this.http.get<any>(this.baseApiUrl, { params})
  					.map( res => 
  						res.results.map((result:Movie)=>{
  							return{
  								...result,
  								backdropUrl:this.createPhotoUrl(result.backdrop_path, true),
  								posterUrl:this.createPhotoUrl(result.poster_path, false)
  							}
  						}) 
  					)
  }

  changeSelectedMovie(movie:Movie){
  	this.seletedMovie$.next(movie)
  }

  setImageConfiguration(){
  	const params = new HttpParams().set('api_key', this.apiKey)
  	this.http.get<any>(this.baseConfigurationUrl, {params}).map(res=>res).subscribe((config)=>{
  		this.imageBaseUrl = config.images.base_url,
  		this.imageSizes = {
  			backdrop:config.images.backdrop_sizes,
  			poster:config.images.poster_sizes
  		}
  	})
  }
  createPhotoUrl(path:string, isBackdrop:boolean){
  	if (!path) { return ""}
  	const { backdrop, poster} = this.imageSizes
  	const imageSize = isBackdrop ? backdrop[0] : poster[poster.length - 1]
  	//same as:
  	//const imageSize = isBackdrop ? this.imageSizes.backdrop[0] : this.imageSizes.poster[this.imageSizes.poster.length - 1]
  	return `${this.imageBaseUrl}${imageSize}${path}`
  }
}


