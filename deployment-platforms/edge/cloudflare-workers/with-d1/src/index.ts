import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export interface Env {
  DB: D1Database
}

const createUsingTx = async(prisma: PrismaClient) => {
	// User data
	const userData = {
		email: 'user@example.com',
		name: 'Example User',
	}

	// Token data
	const tokenData = [
		{ token: 'token1' },
		{ token: 'token2' },
	]

	// トランザクションを使ってユーザーとトークンを作成
  const createdUser = await prisma.$transaction(async (prisma) => {
    // ユーザーを作成
    const newUser = await prisma.user.create({
      data: userData,
    })

    // 作成されたユーザーIDを基にトークンを作成
    const newTokens = await prisma.token.createMany({
      data: tokenData.map(token => ({
        ...token,
        user_id: newUser.id, // 作成されたユーザーのIDを使う
      })),
    })

    return { newUser, newTokens }
  })

  console.log('Created User:', createdUser.newUser)
  console.log('Created Tokens:', createdUser.newTokens)



}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const adapter = new PrismaD1(env.DB)
    const prisma = new PrismaClient({ adapter })

		await createUsingTx(prisma)

    const users = await prisma.user.findMany()
    const result = JSON.stringify(users)
    return new Response(result);
		},


};
