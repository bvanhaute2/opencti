import { cancelTask, createListTask, createQueryTask, listTasks } from '../domain/task';

const vulnerabilityResolvers = {
  Query: {
    tasks: () => listTasks(),
  },
  Mutation: {
    listTaskAdd: (_, { input }, { user }) => createListTask(user, input),
    queryTaskAdd: (_, { input }, { user }) => createQueryTask(user, input),
    taskCancel: (_, { id }, { user }) => cancelTask(user, id),
  },
};

export default vulnerabilityResolvers;
