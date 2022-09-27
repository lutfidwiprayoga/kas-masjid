@extends('layouts.main')
@section('title', 'Pengeluaran')
@section('container')
    <!-- MAIN CONTENT -->
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <!-- CONTEXTUAL -->
                <h4 style="margin-left: 3%">Pengeluaran</h4>
                <p class="demo-button">
                    <button type="button" class="btn btn-primary btn-toastr pull-right" data-toggle="modal" data-target="#data"
                        style="margin-right: 3%">Tambah</button>
                </p><br>
                <div class="panel-body">
                    <table class="table table-striped" id="table-pengeluaran">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Deskripsi</th>
                                <th>Nominal</th>
                                <th>Nota</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($item as $i => $dt)
                                <tr>
                                    <td>{{ ++$i }}</td>
                                    <td>{{ date('l d M Y H:i:s', strtotime($dt->tanggal)) }}</td>
                                    <td>{{ $dt->deskripsi }}</td>
                                    <td>Rp. {{ number_format($dt->pengeluaran) }}</td>
                                    <td><img src="{{ url('foto/' . $dt->foto) }}" width="80px">
                                    </td>
                                    <td>
                                        <div class="row">
                                            <div class="col-sm-1">
                                                <button class="submit badge bg-danger" style="border: 0ch"
                                                    data-target="#deletePengeluaran{{ $dt->id }}"
                                                    data-toggle="modal"><i class="fa fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <!-- END CONTEXTUAL -->
            </div>
        </div>
    </div>
    <!-- Modal Tambah Data -->
    <div class="container">
        <div class="modal fade" id="data" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="data">Pengeluaran</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="{{ route('pengeluaran.post') }}" method="post" enctype="multipart/form-data">
                            @csrf
                            <input type="hidden" name="tanggal" value="{{ $now }}">
                            <div class="form-group">
                                <label for="deskripsi" class="col-form-label">Uraian</label>
                                <input class="form-control" type="hidden" id="deskripsi" name="deskripsi"
                                    value="{{ old('deskripsi') }}">
                                <textarea class="form-control" rows="4" name="deskripsi" id="deskripsi"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="jumlah" class="col-form-label">Nominal</label>
                                <input class="form-control" type="number" id="jumlah" name="pengeluaran"
                                    value="{{ old('pengeluaran') }}">
                            </div>
                            <input type="hidden" name="status" value="pengeluaran">
                            <div class="form-group">
                                <label class="col-form-label" for="foto">Nota</label>
                                <input type="file" class="form-control" id="foto" name="foto" required>
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
    <!-- Modal Update Data -->
    @foreach ($item as $i => $dt)
        <div class="container">
            <div class="modal fade" id="modalPengeluaran{{ $dt->id }}" aria-labelledby="modalLabel" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="data">{{ $title }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form action="{{ route('pengeluaran.update', $dt->id) }}" method="post"
                                enctype="multipart/form-data">
                                @csrf
                                <input type="hidden" name="tanggal" value="{{ $dt->tanggal }}">
                                <div class="form-group">
                                    <label for="deskripsi" class="col-form-label">Uraian</label>
                                    <input class="form-control" type="hidden" id="deskripsi" name="deskripsi"
                                        value="{{ $dt->deskripsi }}">
                                    <textarea class="form-control" rows="4" name="deskripsi" id="deskripsi"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="pengeluaran" class="col-form-label">Nominal</label>
                                    <input class="form-control" type="number" id="pengeluaran" name="pengeluaran"
                                        value="{{ $dt->pengeluaran }}">
                                </div>
                                <input type="hidden" name="status" value="pengeluaran">
                                <div class="form-group">
                                    <label class="col-form-label" for="foto">Nota</label>
                                    <input type="file" class="form-control" id="foto" name="foto" />
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
    @endforeach
    <!-- Modal Delete Data -->
    @foreach ($item as $dt)
        <div class="modal fade" id="deletePengeluaran{{ $dt->id }}">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content bg-default">
                    <div class="modal-header">Tolak Data</div>
                    <form action="{{ route('pengeluaran.delete', $dt->id) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <div class="modal-body">
                            <p>Apakah anda Yakin Mengahapus Data Ini ?&hellip;
                            </p>
                        </div>
                        <div class="modal-footer">
                            <div class="row mt-3 text-center">
                                <button type="button" class="btn btn-light" data-dismiss="modal">Tidak</button>
                                <button type="submit" class="btn btn-danger">Ya,
                                    Hapus</button>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    @endforeach
    <script>
        $(document).ready(function() {
            var tableLaporan = $('#table-pengeluaran').DataTable({});
        });
    </script>
@endsection
