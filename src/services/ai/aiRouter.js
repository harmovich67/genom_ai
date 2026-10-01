import { callGemini } from './gemini';
import { SYSTEM_PROMPTS } from './prompts';

export const aiRouter = {
  /**
   * Analyze code and extract its Code Genome profile
   */
  async extractGenomeDNA(codeSnippet, hints = '') {
    const prompt = `Code to analyze:\n\`\`\`\n${codeSnippet}\n\`\`\`\nAdditional Context/Hints: ${hints}`;
    const result = await callGemini({
      prompt,
      systemInstruction: SYSTEM_PROMPTS.KNOWLEDGE_DNA,
      jsonMode: true
    });
    return result;
  },

  /**
   * Analyze debug case with confidence distinction
   */
  async analyzeBug({ error, code, environment = 'Node/React', stackTrace = '' }) {
    const prompt = `Error:\n${error}\n\nEnvironment: ${environment}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nStack Trace:\n${stackTrace}`;
    const result = await callGemini({
      prompt,
      systemInstruction: SYSTEM_PROMPTS.DEBUG_ANALYSIS,
      jsonMode: true
    });
    return result;
  },

  /**
   * Transform raw idea into comprehensive project blueprint
   */
  async forgeIdea(rawIdeaText) {
    const prompt = `Raw Idea: ${rawIdeaText}`;
    const result = await callGemini({
      prompt,
      systemInstruction: SYSTEM_PROMPTS.IDEA_FORGE,
      jsonMode: true
    });
    return result;
  },

  /**
   * Compare user query/code against library for Signature "Genome Match"
   */
  async findGenomeMatch(queryText, librarySummaries = []) {
    const prompt = `User Query/Code: ${queryText}\n\nUser Library Items:\n${JSON.stringify(librarySummaries)}`;
    const result = await callGemini({
      prompt,
      systemInstruction: SYSTEM_PROMPTS.GENOME_MATCH,
      jsonMode: true
    });
    return result;
  },

  /**
   * Project Memory Assistant chat
   */
  async askProjectAssistant({ projectContext, userQuestion, chatHistory = [] }) {
    const prompt = `Project Context:\n${JSON.stringify(projectContext)}\n\nConversation History:\n${JSON.stringify(chatHistory)}\n\nUser Question:\n${userQuestion}`;
    const result = await callGemini({
      prompt,
      systemInstruction: SYSTEM_PROMPTS.PROJECT_ASSISTANT,
      jsonMode: false
    });
    return result;
  }
};

export default aiRouter;
