import { Controller, Post, Req, Headers, BadRequestException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';
import { db } from '../db/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

@Controller('auth')
export class AuthController {
  
  @Post('webhook')
  async handleClerkWebhook(@Req() req: Request, @Headers() headers: Record<string, string>) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    // Get the headers
    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new BadRequestException('Error occured -- no svix headers');
    }

    // Get the body
    const payload = req.body;
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      throw new BadRequestException('Error occured');
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const email = evt.data.email_addresses[0]?.email_address;
      const firstName = evt.data.first_name || '';
      const lastName = evt.data.last_name || '';
      
      console.log(`Webhook triggered: new user created with ID ${id} and email ${email}`);

      // Insert into our database
      await db.insert(users).values({
        clerkId: id,
        email: email,
        fullName: `${firstName} ${lastName}`.trim() || null,
      }).onConflictDoNothing();
    }

    if (eventType === 'user.updated') {
      const email = evt.data.email_addresses[0]?.email_address;
      const firstName = evt.data.first_name || '';
      const lastName = evt.data.last_name || '';

      await db.update(users)
        .set({
          email: email,
          fullName: `${firstName} ${lastName}`.trim() || null,
        })
        .where(eq(users.clerkId, id));
    }

    if (eventType === 'user.deleted') {
      await db.delete(users).where(eq(users.clerkId, id));
    }

    return { success: true };
  }
}
