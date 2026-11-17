(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RitmoAuthErrors=api})(globalThis,function(){
'use strict';
// Read only machine codes/status. Never echo messages, credentials or tokens.
function details(error){
  const candidates=[error?.error?.error,error?.error,error?.body,error].filter(x=>x&&typeof x==='object');
  const raw=candidates.map(x=>x.code).find(x=>typeof x==='string'&&/^[a-z][a-z0-9_]{1,79}$/i.test(x));
  const status=candidates.map(x=>Number(x.status)).find(x=>Number.isInteger(x)&&x>=400&&x<=599)||0;
  return {code:(raw||'').toUpperCase(),status};
}
function needsVerification(error){return /^(EMAIL_NOT_VERIFIED|EMAIL_NOT_CONFIRMED)$/.test(details(error).code)}
function message(error,stage='signup'){
  const {code,status}=details(error);
  if(/^(INVALID_EMAIL_OR_PASSWORD|INVALID_PASSWORD|INVALID_CREDENTIALS|USER_NOT_FOUND)$/.test(code))return 'E-mail ou senha incorretos.';
  if(/^(USER_ALREADY_EXISTS|EMAIL_EXISTS|USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL)$/.test(code))return 'Este e-mail já possui uma conta. Escolha Entrar ou recupere sua senha.';
  if(needsVerification(error))return 'Confirme seu e-mail com o código recebido para continuar.';
  if(/PASSWORD_TOO_SHORT/.test(code))return 'Use uma senha com pelo menos 8 caracteres.';
  if(/PASSWORD_TOO_LONG/.test(code))return 'Use uma senha com até 128 caracteres.';
  if(/WEAK_PASSWORD|PASSWORD_COMPROMISED|PASSWORD_FOUND_IN_BREACH/.test(code))return 'Escolha uma senha mais forte, com letras, números e símbolos, que você não use em outros serviços.';
  if(/INVALID_EMAIL|EMAIL_ADDRESS_INVALID/.test(code))return 'Confira se o endereço de e-mail foi digitado corretamente.';
  if(/SIGNUP.*DISABLED|SIGN_UP.*DISABLED|EMAIL_AND_PASSWORD.*DISABLED/.test(code))return 'O cadastro por e-mail está desativado no serviço de autenticação. É necessário habilitá-lo no Neon.';
  if(/INVALID_ORIGIN|UNTRUSTED_ORIGIN|INVALID_CALLBACK|INVALID_REDIRECT/.test(code))return 'O serviço de autenticação recusou o domínio do app. A configuração de domínios precisa ser corrigida.';
  if(/OTP|TOKEN.*EXPIRED|INVALID_TOKEN/.test(code))return 'Código inválido ou expirado. Solicite um novo código.';
  if(status===429||/RATE_LIMIT|TOO_MANY/.test(code))return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if(/EMAIL.*SEND|SEND.*EMAIL|SMTP/.test(code))return 'Não foi possível enviar o e-mail. O provedor de e-mail do Neon precisa ser verificado.';
  const reference=[stage.toUpperCase().replace(/[^A-Z_-]/g,''),code,status||''].filter(Boolean).join(' / ');
  if(error?.name==='TypeError'||error?.name==='TimeoutError'||error?.name==='AbortError')return 'O navegador não conseguiu se comunicar com o login. Tente outra rede ou navegador. Referência: '+reference;
  return (status>=500?'O serviço de autenticação não conseguiu concluir a operação.':'Não foi possível concluir esta etapa do acesso.')+' Referência: '+reference;
}
return {details,message,needsVerification};
});
