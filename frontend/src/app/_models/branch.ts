export interface Branch {
    id: number;
    name: string;
    agents: any[]; // или другой тип, если он нужен
    respondents: any[]; // или другой тип, если он нужен
}