import { BookProps } from "../../shared";
import { GeneralPostProps } from "../community/types";

export type TimelinePostProps = GeneralPostProps | BookProps[] | null;
