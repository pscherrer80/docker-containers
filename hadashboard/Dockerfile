FROM ubuntu:latest 
MAINTAINER pscherrer80 <pscherrer80@gmail.com>

# build environment settings
#ENV DEBIAN_FRONTEND noninteractive

# install packages for dashing
RUN apt-get update && \
	apt-get install -y --no-install-recommends build-essential python3-pip git node nodejs libsqlite3-dev postgresql-server-dev-9.4 libpq-dev sqlite && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* 

# Install dashing and bundle
RUN gem install dashing --no-rdoc --no-ri && \
	gem install bundle --no-rdoc --no-ri && \
	gem install execjs --no-rdoc --no-ri

# add hapush python helpers
RUN pip3 install daemonize sseclient configobj && \
	pip3 install --upgrade requests

# Clone hadashboard repository to get bundle gems
RUN git clone https://github.com/acockburn/hadashboard.git && \
	cd /hadashboard && \
	bundle && \
	cd /

COPY files/start.sh /
VOLUME /config

# expose ports
EXPOSE 3030

# Change to hadashboard working directory
WORKDIR /config

CMD ["/start.sh"]
