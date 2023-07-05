import { Actor, AllActions, Remove, Search, Toggle, Write, Add, TarefaActionsEnum, TarefasState } from "./types";

export const makeInitialTarefaState = (): TarefasState => {
  const storedTarefas = localStorage.getItem("tarefas");

  if (storedTarefas) {
    return JSON.parse(storedTarefas);
  }

  return {
    tarefas: [],
    error: "",
    name: "",
    search: "",
  };
};

export const removeTask: Actor<Remove> = (state, action) => {
  const updatedTarefas = state.tarefas.filter(
    (tarefa) => tarefa.id !== action.payload.id
  );
  localStorage.setItem("tarefas", JSON.stringify(updatedTarefas));

  return {
    ...state,
    tarefas: updatedTarefas,
  };
};


export const toggleTask: Actor<Toggle> = (state, action) => {
  return {
    ...state,
    tarefas: state.tarefas.map((t) =>
      t.id === action.payload.id ? { ...t, done: !t.done } : t
    ),
  };
};

export const writeTask: Actor<Write> = (state, { payload }) => {

  const hasTaskAlready = state.tarefas.some((t) => t.name === payload.name);

  if (hasTaskAlready) {
    return {
      ...state,
      name: payload.name,
      error: "Nome da tarefa já existe",
    };
  }

  return {
    ...state,
    error: "",
    name: payload.name,
  };
};

export const addTask: Actor<Add> = (state) => {
  if (state.name === "") {
    return {
      ...state,
      error: "Nome da tarefa não pode ser vazio",
    };
  }

  if (state.error) {
    return state;
  }

  const newTarefa = {
    id: (state.tarefas.length + 1).toString(),
    name: state.name,
    done: false,
    createdAt: new Date(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Definindo o prazo de uma semana a partir da data atual
  };

  const updatedTarefas = [...state.tarefas, newTarefa];
  localStorage.setItem("tarefas", JSON.stringify(updatedTarefas));

  return {
    ...state,
    tarefas: updatedTarefas,
    error: "",
    name: "",
  };
};

export const searchTask: Actor<Search> = (state, action) => {
  return {
    ...state,
    search: action.payload.search,
  };
};

export const tarefaReducer = (
  state: TarefasState,
  action: AllActions
): TarefasState => {
  switch (action.type) {
    case TarefaActionsEnum.add:
      return addTask(state, action);

    case TarefaActionsEnum.remove:
      return removeTask(state, action);

    case TarefaActionsEnum.toggle:
      return toggleTask(state, action);

    case TarefaActionsEnum.write:
      return writeTask(state, action);

    case TarefaActionsEnum.search:
      return searchTask(state, action);

    default:
      return state;
  }
};
