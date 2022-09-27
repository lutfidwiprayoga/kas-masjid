@extends('layouts.main')

@section('container')
<div class="panel panel-profile">
    <div class="clearfix">
        <!-- LEFT COLUMN -->
        <div class="profile-left">
            <!-- PROFILE HEADER -->
            <div class="text-center">
                <div class="overlay"></div>
                <div class="profile-main" style="padding-top: 22%">
                    <img src="{{ url('profile/'.auth()->user()->foto) }}" class="img-circle" alt="Avatar" width="100px">
                    <h3 class="name" style="padding-bottom: 23%">{{ auth()->user()->name }}</h3>
                </div>
            </div>
            <!-- END PROFILE HEADER -->
        </div>
        <!-- END LEFT COLUMN -->
        <!-- RIGHT COLUMN -->
        <div class="profile-right">
            <div class="card-body">
                <div class="row">
                  <div class="col-sm-3">
                    <h5 class="mb-0">Nama</h5>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {{ auth()->user()->name }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h5 class="mb-0">Email</h5>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {{ auth()->user()->email }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h5 class="mb-0">Alamat</h5>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {{ auth()->user()->alamat }}
                  </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-3">
                      <h5 class="mb-0">Telepon</h5>
                    </div>
                    <div class="col-sm-9 text-secondary">
                      {{ auth()->user()->no_hp }}
                    </div>
                  </div>
                  <hr>
                <div class="row">
                  <div class="col-sm-12">
                      <button class="btn btn-primary" style="border: 0ch"
                          data-toggle="modal"
                          data-target="#modalEdit">
                          Edit
                      </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <!-- END RIGHT COLUMN -->
    </div>
</div>
    <div class="container">
        <div class="modal fade" id="modalEdit" aria-labelledby="modalLabel" tabindex="-1">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="data">{{ $title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form action="{{ route('register.update') }}"  method="post" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group">
                            <label for="name" class="col-form-label">Nama</label>
                            <input type="text" class="form-control" type="text" id="name" name="name" value="{{ auth()->user()->name }}">
                        </div>
                        <input type="hidden" name="email" value="{{ auth()->user()->email }}">
                        <div class="form-group">
                            <label for="no_hp" class="col-form-label">Alamat</label>
                            <input class="form-control" type="text" id="alamat" name="alamat" value="{{ auth()->user()->alamat }}">
                        </div>
                        <div class="form-group">
                            <label for="no_hp" class="col-form-label">Telepon</label>
                            <input class="form-control" type="number" id="no_hp" name="no_hp" value="{{ auth()->user()->no_hp }}">
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="foto">Foto</label>
                            <input type="file" class="form-control" id="foto" name="foto">
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                            <button type="submit" class="btn btn-primary">Kirim</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    </div>
@endsection
