import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
    state(){
        return {
            initialCode: [
                "def fibonacci(n):\n",
                "    a, b = 0, 1",
                "    if n < 0:",
                "        yield 'Incorrect input'",
                "    elif n <= 1:",
                "        yield n",
                "    else:",
                "        for i in range(1, n+1):",
                "            yield a",
                "            a, b = b, a + b\n",
                "for i in fibonacci(10):",
                "   print(i)",
            ],
        };
    },
    mutations,
    actions,
    getters
}