<!doctype html>
<html lang="en" class="fullscreen-bg">

<head>
	<title>{{ $title }}</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<!-- VENDOR CSS -->
	<link rel="stylesheet" href="assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="assets/vendor/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="assets/vendor/linearicons/style.css">
	<!-- MAIN CSS -->
	<link rel="stylesheet" href="assets/css/main.css">
	<!-- FOR DEMO PURPOSES ONLY. You should remove this in your project -->
	<link rel="stylesheet" href="assets/css/demo.css">
	<!-- GOOGLE FONTS -->
	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet">
	<!-- ICONS -->
	<link rel="apple-touch-icon" sizes="76x76" href="assets/img/masjid.png">
	<link rel="icon" type="image/png" sizes="96x96" href="assets/img/masjid.1.png">
</head>

<body>
	<!-- WRAPPER -->
	<div id="wrapper">
		<div class="vertical-align-wrap">
			<div class="vertical-align-middle">
				<div class="auth-box ">
                    <div class="left">
						<div class="content">
							<div class="header">
								<p class="lead">Account registration</p>
							</div>
							<form class="form-auth-small" action="/register" method="post">
                                @csrf
								<div class="form-group">
									<label for="name" class="control-label sr-only ">Name</label>
									<input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" placeholder="Nama" required>
                                    @error('name')
                                    <div class="invalid-feedback text-danger">
                                        {{ $message }}
                                    </div>
                                    @enderror
								</div>
                                <div class="form-group">
									<label for="email" class="control-label sr-only ">Email</label>
									<input type="email" class="form-control @error('email') is-invalid @enderror" id="email" name="email" value="{{ old('email') }}" placeholder="Email" required>
                                    @error('email')
                                    <div class="invalid-feedback text-danger">
                                        {{ $message }}
                                    </div>
                                    @enderror
								</div>

                                <div class="form-group">
									<label for="alamat" class="control-label sr-only ">Alamat</label>
									<input type="text" class="form-control @error('alamat') is-invalid @enderror" id="alamat" name="alamat" value="{{ old('alamat') }}" placeholder="Alamat" required>
                                    @error('alamat')
                                    <div class="invalid-feedback text-danger">
                                        {{ $message }}
                                    </div>
                                    @enderror
								</div>
                                <input type="hidden" name="role" value="donatur">
                                <div class="form-group">
									<label for="no telp" class="control-label sr-only ">No Telp</label>
									<input type="text" class="form-control @error('no_hp') is-invalid @enderror" id="no_hp" name="no_hp" value="{{ old('no_hp') }}" placeholder="No Telp" required>
                                    @error('no_hp')
                                    <div class="invalid-feedback text-danger">
                                        {{ $message }}
                                    </div>
                                    @enderror
								</div>
                                <div class="form-group">
									<label for="password" class="control-label sr-only ">Password</label>
									<input type="password" class="form-control " id="password" name="password" value="" placeholder="Password" required>

								</div>
								<button type="submit" class="btn btn-primary btn-lg btn-block">Register</button>
							</form>
				</div>
			</div>
            <div class="right">
            </div>
		</div>
	</div>
	<!-- END WRAPPER -->
</body>

</html>
