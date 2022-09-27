<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;

class InfoController extends Controller
{
    public function index(){

        return view('info.index', [
            'title' => 'Info'
        ]);
    }
}
