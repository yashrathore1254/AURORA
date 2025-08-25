import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const cohortChatGptIndex = pc.Index('cohort-chat-gpt');


export async function createVector({ messageId, vectors, metadata }) {
    await cohortChatGptIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])

}

export async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await cohortChatGptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })

    return data.matches
}

