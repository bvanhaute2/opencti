import { generateTaskId } from '../schema/identifier';
import { redisCreateTask, redisFetchTasks, redisGetTask } from '../database/redis';
import { now } from '../utils/format';

const TASK_TYPE_QUERY = 'QUERY';
const TASK_TYPE_LIST = 'LIST';

// taskDefinition
// { type: delete }
// { type: add_relation, data: { relation_type, targetId } }
// { type: delete_relation, data: { relation_type, targetId } }
// { type: update_attribute, data: { field, value } }

const createDefaultTask = (user, id, definition, type, taskExpectedNumber) => {
  return {
    id,
    type,
    initiator_id: user.internal_id,
    definition: JSON.stringify(definition),
    created_at: now(),
    task_expected_number: taskExpectedNumber,
    task_processed_number: 0,
    errors: JSON.stringify([]),
  };
};

export const listTasks = async () => {
  const tasks = await redisFetchTasks();
  return tasks.map((t) => ({
    ...t,
    definition: (t.definition && JSON.parse(t.definition)) || '',
    errors: (t.errors && JSON.parse(t.errors)) || [],
    task_ids: (t.task_ids && JSON.parse(t.task_ids)) || [],
    task_query: (t.task_query && JSON.parse(t.task_query)) || [],
  }));
};

export const loadTask = (user, taskId) => {
  return redisGetTask(taskId);
};

export const createQueryTask = async (user, input) => {
  const { definition, query } = input;
  const taskId = generateTaskId();
  // Run the query to count expected processing number
  const countExpected = 0; // TODO
  const task = createDefaultTask(user, taskId, definition, TASK_TYPE_QUERY, countExpected);
  const queryTask = { ...task, task_query: JSON.stringify(query), query_after: null };
  await redisCreateTask(queryTask);
  return task;
};

export const createListTask = async (user, input) => {
  const { type, data, ids } = input;
  const definition = { type, data };
  const taskId = generateTaskId();
  const task = createDefaultTask(user, taskId, definition, TASK_TYPE_LIST, ids.length);
  const listTask = { ...task, task_ids: JSON.stringify(ids), ids_next: null };
  await redisCreateTask(listTask);
  return task;
};

export const cancelTask = async (user, taskId) => {};
