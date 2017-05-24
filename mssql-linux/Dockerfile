FROM microsoft/mssql-server-linux:latest

RUN apt update && \
	apt install -y \
		python \
		sudo

ENV SA_PASSWORD=My@Super@Secret

#RUN /opt/mssql/bin/sqlservr-setup --accept-eula --set-sa-password
RUN /opt/mssql/bin/sqlservr.sh --accept-eula --set-sa-password

ADD entrypoint.sh /

ENTRYPOINT /entrypoint.sh
