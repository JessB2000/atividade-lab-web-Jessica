import { Typography } from "@mui/material";
import { TarefaItem } from "./tarefaItem";

import { AllActions } from "../domain/reducers";
import { Tarefa, makeSearchByName } from "../domain/model/tarefa";

interface Props {
  tarefas: Tarefa[];
  search: string;
  dispatch: (tarefas: AllActions) => void;
  goToTarefa: (id: string) => void;
}

export const ListaTarefas = ({
  search,
  tarefas,
  dispatch,
  goToTarefa,
}: Props) => {
  const doSearch = makeSearchByName(search);

  const deleteTask = (id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  };

  const toggleDone = (id: string) => {
    dispatch({ type: "TOGGLE", payload: { id } });
  };

  const hasTasks = tarefas.length > 0;

  return (
    <div style={{
      marginTop: "4%",
      display: "flex",
      width: "100%",
      flexDirection: "column",
    }}>
      {!hasTasks && (
        <Typography
          variant="body1"
          style={{ textAlign: "center" }}
        >
          Sem tarefas criadas 😶
        </Typography>
      )}
      {tarefas
        .filter((tarefa) => doSearch(tarefa))
        .map((tarefa) => (
          <TarefaItem
            tarefa={tarefa}
            key={tarefa.id}
            onDelete={deleteTask}
            toggleDone={toggleDone}
            goToTarefa={goToTarefa}
          />
        ))}
    </div>
  );
};