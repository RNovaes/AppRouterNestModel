import { Body, Controller, Get, Post, Res, Request, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';
import { UsuarioAlterarSenhaDto } from './dto/usuario.alterar.senha.dto';

var nodemailer = require('nodemailer');

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService,
        private authService: AuthService,
        private readonly tokenService: TokenService) { }

    @Post('cadastrar')
    async cadastrar(@Body() data: UsuarioCadastrarDto): Promise<ResultadoDto> {
        console.log(data)
        return this.usuarioService.cadastrar(data)
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('login-token')
    async loginToken(@Request() req, @Body() data) {
        return this.authService.loginToken(data.token);
    }

    @Post('verificar')
    async verificaruser(@Body() data) {
        //console.log(data)
        return this.usuarioService.verificar(data)
    }

    @Post('verificar-email')
    async verificaremail(@Body() data) {
        return this.usuarioService.verificarEmail(data)
    }

    @Post('recuperar')
    async recuperarsenha(@Body() data) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'renato.bisponovaes@gmail.com',
                pass: 'lvgu kshe vhha qoga'
            }
        });

        var mailOptions = {
            from: 'renato.bisponovaes@gmail.com',
            to: data.email,
            subject: 'Email de Recuperação de Senha',
            text: 'Sua nova senha é: ' + data.senha
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    @Post('novasenha')
    async novasenha(@Body() data: UsuarioAlterarSenhaDto) {
        return this.usuarioService.novasenha(data)
    }
}