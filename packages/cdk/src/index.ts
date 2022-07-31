import { App } from "aws-cdk-lib";
import GraphiqueStack from "./stack";

const app = new App();
new GraphiqueStack(app, "Graphique");
