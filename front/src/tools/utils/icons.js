import Loader from "react-loader-spinner";

export const PlusSVGIcon = ({ classes, title, width }) => {
	return (
		<svg width={width} className={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
			<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
			{title && <title>{title}</title>}
		</svg>
	);
};

export const EditSVGIcon = ({ classes, title, width }) => {
	return (
		<svg width={width} className={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
			{title && <title>{title}</title>}
		</svg>
	);
};

export const LoaderSpinner = () => {
	return (
		<div className="Loader">
			<Loader type="TailSpin" color="#7a7a7a" height={60} width={60} />
		</div>
	);
};

export const BackArrowSVGIcon = ({ classes, title, width, color }) => {
	return (
		<svg width={width} className={classes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
			<path
				d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
				fill={color}
			/>
			{title && <title>{title}</title>}
		</svg>
	);
};
