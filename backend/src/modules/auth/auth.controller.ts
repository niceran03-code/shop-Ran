import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------
  // LOGIN
  // -------------------
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  // -------------------
  // REGISTER
  // -------------------
  @Post('register')
  @ApiOkResponse({ type: AuthEntity })
  register(@Body() registerDto: RegisterDto) {
    const { email, password, username } = registerDto;
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOkResponse({ type: AuthEntity })
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }
}
