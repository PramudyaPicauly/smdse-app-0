export interface ISession {
	expires?: string;
	user: {
		id?: string;
		email?: string;
		name?: string;
		position?: string;
		role?: string;
	};
}

export interface ISignInCredentials {
	email?: string;
	password?: string;
}

export interface IUserData {
	id?: string;
	email?: string;
	name?: string;
	position?: string;
	role?: string;
	isActive?: boolean;
	documentCreated?: [];
	documentReceived?: [];
}

export interface IDocumentData {
	id?: string;
	createdAt?: string;
	isSent?: boolean;
	isApproved?: boolean;
	content?: IDisposisiContent;
	type?: string;
	authorId?: string;
	recipients?: [];
}

export interface IDisposisiContent {
	nomor?: string;
	tanggal?: string;
	indeks?: string;
	suratDari?: string;
	nomorSurat?: string;
	tanggalSurat?: string;
	perihal?: string;
	tanggalDiterima?: string;
	diterimaMelalui?: string;
	diteruskanKepada?: {
		direksi?: boolean;
		manajemenRepresentative?: boolean;
		auditorInternal?: boolean;
		manajerSertifikasi?: boolean;
		penanggungJawabTeknik?: boolean;
		koordinatorPJT?: boolean;
		tenagaTeknik?: boolean;
		administratorUji?: boolean;
		staffAdministrasi?: boolean;
		staffKeuangan?: boolean;
	};
	isi?: any[];
	dikembalikanKepada?: string;
	dikembalikanTanggal?: string;
	resume?: string;
	pemberi?: string;
	penerima1?: string;
	penerima2?: string;
	jabatanPemberi?: string;
	jabatanPenerima1?: string;
	jabatanPenerima2?: string;
}

export interface IUserOnDocument {
	recipientId?: string;
	recipient?: {};
	documentId?: string;
	document?: {};
}
