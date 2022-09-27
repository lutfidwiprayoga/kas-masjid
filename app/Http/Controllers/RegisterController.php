<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function index(){

        return view('register.index', [
            'title' => 'Register'
        ]);
    }

    public function store(Request $request){

        $data = User::get();
        $validatedData = $request -> validate([
            'name' => 'required|max:255',
            'role' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'alamat' => 'required|max:255',
            'no_hp' => 'required',
            'password' => 'required|min:5|max:255'
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        User::create($validatedData);

        return redirect('/login')->with('succes', 'Registration succesfull!, Please login');
    }

    public function update(Request $request){

        $id_user = Auth::user()->id;
        $data = User::find($id_user);
        $data->name = $request->name;
        $data->email = $request->email;
        $data->alamat = $request->alamat;
        $data->no_hp = $request->no_hp;
        if($request->hasFile('foto')){
            $request->file('foto')->move('profile/',$request->file('foto')->getClientOriginalName());
            $data->foto = $request->file('foto')->getClientOriginalName();
        }
        $data->save();

        return redirect()->back();
    }
}
