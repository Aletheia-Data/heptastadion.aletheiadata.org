import { css } from 'emotion';

const nav = css`
	width: 100%;
	box-shadow: 0 1px 4px hsla(0,0%,0%,0.1), 0 4px 16px hsla(0,0%,0%,0.07);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fff;
	color: #000;
	height: 72px;
	padding: 0 15px;
	@media all and (max-width: 768px) {
		flex-direction: column;
		height: 100px;
	}
`;

const title = css`
	@import url('https://fonts.googleapis.com/css?family=Pacifico');
	font-size: 25px;
	letter-spacing: 0.05rem;
	font-family: Pacifico, sans-serif;
`;

const search = css`
	width: calc(100%);
	@media all and (max-width: 768px) {
		width: 100%;
		padding-right: 20%;
	}
	@media all and (max-width: 480px) {
		width: 100%;
		padding-right: 35%;
	}
`;

const container = css`
	display: flex;
	padding-top: 52px;
	@media all and (max-width: 768px) {
		padding-top: 82px;
	}
`;

const leftCol = css`
	width: 280px;
	height: 100%;
	padding: 15px 20px;
	position: fixed;
	z-index: 10;
	left: 0;
	right: 0;
	border-right: 1px solid #f0f0f0;
	box-shadow: inset 5px -1px 10px rgba(0,0,0,.2);
	padding-bottom: 40px;
    overflow: scroll;
    height: 80%;

	& > div {
		margin: 40px 0;
	}

	@media all and (max-width: 768px) {
		position: static;
		width: 100%;
		height: auto;
		border-right: 0;
		border-bottom: 1px solid #f0f0f0;
	}
`;

const rightCol = css`
	width: calc(100% - 280px);
	height: calc(100vh - 52px);
	left: 280px;
	padding-top: 20px;
	padding-bottom: 50px;
	position: absolute;

	.list {
		margin-bottom: 30px;
	}

	.card-container {
		width: calc(100% - 480px);
		background-color: #fbfbfb;
		padding: 20px 0;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-around;
	}

	.card {
		width: 44%;
		height: auto;
		margin-bottom: 20px;
		background-color: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		position: relative;
		padding: 0;

		h2 {
			padding-bottom: 4px;
			font-size: 1rem;
			margin: 10px 0 0;
		}

		.card__image {
			width: 100%;
			height: 180px;
			background-size: cover;
			background-position: center center;
		}

		.card__price {
			width: 70px;
			height: 44px;
			background-color: #424242;
			position: absolute;
			top: 120px;
			left: 0;
			color: #fafafa;
			font-size: 18px;
			display: flex;
			justify-content: center;
			align-items: center;
			letter-spacing: 0.03rem;
		}

		.card__info {
			color: #555;
			font-size: 14px;
			margin: 0;
			margin-bottom: 4px;
		}
	}

	.result-stats {
		text-align: right;
		color: #666;
		font-size: 15px;
	}

	.map-container {
		width: 480px;
		height: calc(100% - 52px);
		position: fixed;
		right: 0;
	}

	@media all and (min-width: 1441px) {
		.list-item {
			width: calc(25% - 16px);
		}
	}

	@media all and (max-width: 1024px) {
		.list-item {
			width: calc(50% - 16px);
		}
	}

	@media all and (max-width: 768px) {
		width: 100%;
		position: static;
		padding: 25px 15px;
	}

	@media all and (max-width: 480px) {
		.list-item {
			width: calc(100% - 16px);
			margin-bottom: 20px;
		}
	}
`;

export {
	nav,
	container,
	leftCol,
	rightCol,
	search,
	title
};
