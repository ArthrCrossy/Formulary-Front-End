// @ts-ignore
import express, {Request, response, Response} from "express";
import axios, {AxiosResponse} from "axios";

const app = express();
const PORT = 3000;

let response: AxiosResponse<any, any>;


app.get("/consome-funcionarios", async (req: Request, res: Response) => {
  try {
    response = await axios.get("http://localhost:8081/api/funcionarios");
    console.log("Dados dos funcionários:", response.data);
    console.log("oi")
    res.json(response.data);
    console.log(response.data)
  } catch (error: any) {
    console.error("Erro ao buscar funcionários:", error.message);
    res.status(500).json({ error: "Erro ao buscar funcionários" });
  }

});

app.listen(PORT, () => {
  console.log("oi")
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})
