import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'test@test.com',
      username: 'ranran',
    },
  })
  user: any;
}
