/// <reference types="react" />
import { TypeFooterbarProps } from '../../types/cgpv-types';
export declare const useStyles: (props?: any) => import("@mui/styles").ClassNameMap<"footerBarContainer" | "mouseScaleControlsContainer">;
/**
 * Create a footerbar element that contains attribtuion, mouse position and scale
 *
 * @param {TypeFooterbarProps} props the footerbar properties
 * @returns {JSX.Element} the footerbar element
 */
export declare function Footerbar(props: TypeFooterbarProps): JSX.Element;
