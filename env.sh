#!/usr/bin/env bash

help ()
{
	p_filename=$0

	tee <<DOC
Использование: "$p_filename" - создать файлы .env и .htaccess
Параметры:
	-h, --help		показать эту справку
	-s, --ssl		добавить в .htaccess редирект на SSL
DOC
}

main ()
{
	p_is_ssl=$1

	# .htaccess:
	if [ ! -s .htaccess ]; then
		whichnode=$(which node)
		sed "s|{{appRoot}}|`pwd`|" .htaccess.dist | sed "s|{{nodePath}}|$whichnode|" > .htaccess
	fi

	if [ -n "$p_is_ssl" ]; then
		add_ssl_redirect
	fi

	# JS env:
	if [ ! -s .env ]; then
		cp .env.dist .env
	fi

	# Output:
	echo -e "Your .htaccess and .env is created!"
}

add_ssl_redirect ()
{
	v_has_ssl_config=$(grep '\!\^443\$' .htaccess)
	if [ -n "$v_has_ssl_config" ]; then
		return
	fi

	tee -a .htaccess <<DOC > /dev/null

RewriteEngine On
RewriteCond %{SERVER_PORT} !^443$
RewriteRule .* https://%{SERVER_NAME}%{REQUEST_URI} [R,L]
DOC
}

v_to_redirect_ssl=""
for a in "$@"
do
	case $a in
		-h|--help)
			help
			exit 1;;
		-s*|--ssl)
			v_to_redirect_ssl="true";;
	esac
done

main $v_to_redirect_ssl
