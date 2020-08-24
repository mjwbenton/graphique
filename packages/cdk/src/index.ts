import { App } from "@aws-cdk/core";
import GraphiqueStack from "./stack";

const app = new App();
new GraphiqueStack(app, "Graphique");
