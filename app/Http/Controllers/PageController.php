<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(){

        $data = Artikel::all();
        return view('master.page',compact('data'), [
            'title' => 'Masjid Subulussalam'
        ]);
    }
}
