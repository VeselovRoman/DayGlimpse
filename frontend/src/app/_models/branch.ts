import { Agent } from "./agent";
import { Respondent } from "./respondent";

export interface Branch {
    id: number;
    name: string;
    agents: Agent; 
    respondents: Respondent; 
}