var fs = require('fs');
const axios = require('axios-https-proxy-fix');
const lineReader = require('line-reader');
const gradient = require('gradient-string');
const clc = require('cli-color');
const randomUseragent = require('random-useragent');
const setTitle = require('console-title');
const config = require('./config.json');
 var success = 0;
var invalid = 0;
var locked = 0;

function logo(){
  console.log(gradient.vice(`
████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║    ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║    ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

                                          By Elminsterxld#0007
\n`))}


function check_token(token, proxy) {
  if (proxy){
    proxy = proxy.split(':')
    if (proxy.length === 2){
      proxy = {
        host: proxy[0],
        port: proxy[1]
      }
    }
    else{
      proxy = {
        host: proxy[2],
        port: proxy[3],
        auth: {username: proxy[0], password: proxy[1]}
      }
    }
  }
  setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
        'Authorization': token,
        'User-Agent': randomUseragent.getRandom( ua => ua.browserName === 'Chrome')
      },
      proxy: proxy
    }).then(
      response => {
        if (response.status == 200) {
  
          var data = response.data;
let a = data.id

  const timestamp = ((a / 4194304) + 1420070400000);
let x =  new Date(timestamp).toUTCString()

  console.log(clc.green(` [+] Alive token: ${data.username}#${data.discriminator}\n ID: ${data.id} \n Email: ${data.email}\n Phone: ${data.phone} \n Verified: ${data.verified} \n Bio :${data.bio} \n Locale : ${data.locale} \n MFA : ${data.mfa_enabled} \n Avatar : https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=128 \n Nsfw : ${data.nsfw_allowed} \n Flags :${data.flags} \n Creation Date : ${x}`))
            success += 1
         setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  
            
            let content = '';
            if (config.only_save_token){
              content = token+'\n';
            }
            else{
              content = `[+] Discord Token Checker [+]\n[+] Token: ${token}`
              if (config.capture.id) content += `\n[+] ID: ${data.id}`
              if (config.capture.username) content += `\n[+] Username: ${data.username}#${data.discriminator}`
              if (config.capture.email) content += `\n[+] Email: ${data.email}`
              if (config.capture.phone) content += `\n[+] Phone: ${data.phone}`
              if (config.capture.verified) content += `\n[+] Verified: ${data.verified}`
              if (config.capture.bio) content += `\n[+] Bio :${data.bio}`
              if (config.capture.local) content += `\n[+] Locale : ${data.locale}`
              if (config.capture.mfa) content += `\n[+] MFA : ${data.mfa_enabled}`
              if (config.capture.avatar) content += `\n[+] Avatar : https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=128`
              if (config.capture.nsfw) content += `\n[+] Nsfw : ${data.nsfw_allowed}`
              if (config.capture.flags) content += `\n[+] Flags :${data.flags}`
              if (config.capture.createdtime) content += `\n[+] Createdtime :${x}`

            content += '\n\n'
          }
          
          fs.appendFile(__dirname + '/valid.txt', content, err => {
            if (err) {
              console.log(clc.red("[!] Error saving good token to file."))
            }
          })
        }
        else {
          console.log(clc.red("[!] Unknown error with token:", token, response.status))
          invalid += 1
         setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
      }
    }
    )
    .catch(
      error => {
        if (error.code === "ERR_SOCKET_BAD_PORT"){
          console.log(clc.red("[!] Bad Proxy"))
          return
        }
        else if (!error.response){
          console.log(clc.yellow(error.message))
        }
        else if (error.response.status === 401) {
          console.log(clc.red("[-] Bad token:", token))
          invalid += 1
         setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
        else if (error.response.status == 403) {
          console.log(clc.yellow("[-] Locked token:", token))
          locked += 1
         setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  
          if (config.save_locked){
            fs.appendFile(__dirname + '/locked.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
        else {
          console.log(clc.red("[!] Unknown error with token:", token))
          invalid += 1
         setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
      }
    )
}

async function main(){
  if (config.use_proxy){
    try{
      var proxies = fs.readFileSync(__dirname + '/proxies.txt', 'utf8')
      proxies = proxies.split('\r\n')
    } catch (err) {
      console.log(clc.red("[!] Error reading proxy file:", err.message))
      return
    }    
  }
  lineReader.eachLine(__dirname + '/tokens.txt',(line,last)=>{
    if (config.use_proxy){
      check_token(line, proxies[Math.floor(Math.random()*proxies.length)])
    }
    else{
      check_token(line)
    }
  })
  
}

logo()
main()
